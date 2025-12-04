"use client";

import { useReceipt } from "@/contexts/ReceiptContext";
import type { ReceiptItem } from "@/contexts/ReceiptContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FormDialog } from "@/components/shared/form-dialog";
import { Users, ArrowLeft, Plus, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function SplitByItemPage() {
  const router = useRouter();
  const { parsedReceipt } = useReceipt();
  const [people, setPeople] = useState<string[]>([]);
  const [itemAssignments, setItemAssignments] = useState<
    Record<number, string[]>
  >({});
  const [addPersonDialogOpen, setAddPersonDialogOpen] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [splitResult, setSplitResult] = useState<{
    personTotals: Record<string, number>;
    unassignedItems: Array<{ item: ReceiptItem; index: number }>;
  } | null>(null);

  useEffect(() => {
    if (!parsedReceipt) {
      router.push("/upload-receipt");
    }
  }, [parsedReceipt, router]);

  if (!parsedReceipt) {
    return (
      <div className="size-full flex items-center justify-center">
        <div>Redirecting...</div>
      </div>
    );
  }

  const { generatedContent } = parsedReceipt;
  const { items, tax, tips } = generatedContent;

  const handleAddPerson = () => {
    if (newPersonName.trim() && !people.includes(newPersonName.trim())) {
      setPeople([...people, newPersonName.trim()]);
      setNewPersonName("");
      toast.success(`${newPersonName.trim()} added!`);
    }
  };

  const handleRemovePerson = (personToRemove: string) => {
    setPeople(people.filter((p) => p !== personToRemove));
    // Remove all assignments for this person
    const updatedAssignments = { ...itemAssignments };
    Object.keys(updatedAssignments).forEach((key) => {
      updatedAssignments[Number(key)] = updatedAssignments[Number(key)].filter(
        (p) => p !== personToRemove
      );
    });
    setItemAssignments(updatedAssignments);
    toast.info(`${personToRemove} removed`);
  };

  const handleToggleItemAssignment = (
    itemIndex: number,
    personName: string
  ) => {
    setItemAssignments((prev) => {
      const current = prev[itemIndex] || [];
      const isAssigned = current.includes(personName);

      return {
        ...prev,
        [itemIndex]: isAssigned
          ? current.filter((p) => p !== personName)
          : [...current, personName],
      };
    });
  };

  const calculateSplit = () => {
    if (people.length === 0) {
      toast.error("Please add at least one person");
      return;
    }

    const personTotals: Record<string, number> = {};
    const unassignedItems: Array<{ item: ReceiptItem; index: number }> = [];

    people.forEach((person) => {
      personTotals[person] = 0;
    });

    // Calculate item totals and track unassigned items
    items.forEach((item: ReceiptItem, index: number) => {
      const assignedPeople = itemAssignments[index] || [];
      if (assignedPeople.length > 0) {
        const splitAmount = item.price / assignedPeople.length;
        assignedPeople.forEach((person) => {
          personTotals[person] += splitAmount;
        });
      } else {
        unassignedItems.push({ item, index });
      }
    });

    // Add tax and tips proportionally
    const assignedTotal = Object.values(personTotals).reduce(
      (sum, val) => sum + val,
      0
    );
    if (assignedTotal > 0) {
      const extraCharges = tax + tips;
      people.forEach((person) => {
        const proportion = personTotals[person] / assignedTotal;
        personTotals[person] += extraCharges * proportion;
      });
    }

    setSplitResult({ personTotals, unassignedItems });
    toast.success("Split calculated successfully!");
  };

  const getItemAssignmentCount = (itemIndex: number) => {
    return itemAssignments[itemIndex]?.length || 0;
  };

  const totalAssignedItems = Object.keys(itemAssignments).filter(
    (key) => itemAssignments[Number(key)].length > 0
  ).length;

  return (
    <div className="size-full flex flex-col items-center justify-center py-6">
      <div className="container mx-auto px-6 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => router.push("/itemized-list")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Receipt
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Split by Item
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Assign items to people, then calculate how much each person owes
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* People Section */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">People ({people.length})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddPersonDialogOpen(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Person
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {people.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Add people to start splitting items
                  </p>
                ) : (
                  people.map((person, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => handleRemovePerson(person)}
                    >
                      {person} ×
                    </Badge>
                  ))
                )}
              </div>
              {people.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Click on a name to remove them
                </p>
              )}
            </div>

            <Separator />

            {/* Items Assignment */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">
                  Assign Items ({totalAssignedItems}/{items.length})
                </h3>
              </div>

              {people.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Add people first to start assigning items</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item: ReceiptItem, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex-1">
                          <span className="font-medium">{item.name}</span>
                          {item.quantity > 1 && (
                            <span className="text-sm text-muted-foreground ml-2">
                              × {item.quantity}
                            </span>
                          )}
                        </div>
                        <div className="text-right min-w-[100px]">
                          <span className="font-medium block">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="block text-xs h-4">
                            {getItemAssignmentCount(index) > 0 && (
                              <span className="text-blue-600 dark:text-blue-400">
                                Split {getItemAssignmentCount(index)} way
                                {getItemAssignmentCount(index) > 1 ? "s" : ""}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Assignment checkboxes */}
                      <div className="flex flex-wrap gap-3">
                        {people.map((person) => (
                          <div
                            key={person}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`item-${index}-${person}`}
                              checked={
                                itemAssignments[index]?.includes(person) ||
                                false
                              }
                              onCheckedChange={() =>
                                handleToggleItemAssignment(index, person)
                              }
                            />
                            <label
                              htmlFor={`item-${index}-${person}`}
                              className="text-sm cursor-pointer select-none"
                            >
                              {person}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculate Button */}
            <div className="pt-4">
              <Button
                className="w-full"
                size="lg"
                onClick={calculateSplit}
                disabled={people.length === 0 || totalAssignedItems === 0}
              >
                Calculate Split
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Split Result */}
        {splitResult && (
          <Card className="mt-6 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <DollarSign className="h-5 w-5" />
                Split Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(splitResult.personTotals).map(
                ([person, amount]) => (
                  <div
                    key={person}
                    className="flex items-center justify-between p-4 bg-white dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="font-semibold text-lg">{person}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        ${amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              )}

              <Separator />

              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold">Assigned Total</span>
                <span className="text-xl font-bold">
                  $
                  {Object.values(splitResult.personTotals)
                    .reduce((sum, val) => sum + val, 0)
                    .toFixed(2)}
                </span>
              </div>

              {/* Unassigned Items Section */}
              {splitResult.unassignedItems.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <h3 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                      Unassigned Items ({splitResult.unassignedItems.length})
                    </h3>
                    <div className="space-y-2">
                      {splitResult.unassignedItems.map(({ item, index }) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800"
                        >
                          <div>
                            <span className="font-medium">{item.name}</span>
                            {item.quantity > 1 && (
                              <span className="text-sm text-muted-foreground ml-2">
                                × {item.quantity}
                              </span>
                            )}
                          </div>
                          <span className="font-semibold text-amber-700 dark:text-amber-400">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2 px-3">
                      <span className="font-semibold text-amber-700 dark:text-amber-400">
                        Unassigned Total
                      </span>
                      <span className="text-lg font-bold text-amber-700 dark:text-amber-400">
                        $
                        {splitResult.unassignedItems
                          .reduce((sum, { item }) => sum + item.price, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setSplitResult(null)}
              >
                Clear Result
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Person Dialog */}
      <FormDialog
        open={addPersonDialogOpen}
        onOpenChange={setAddPersonDialogOpen}
        title="Add Person"
        description="Enter the name of the person sharing this bill"
        fieldLabel="Person Name"
        fieldPlaceholder="e.g., John"
        fieldValue={newPersonName}
        onFieldChange={setNewPersonName}
        onConfirm={handleAddPerson}
        confirmDisabled={!newPersonName.trim()}
        confirmText="Add"
      />
    </div>
  );
}
