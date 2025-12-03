"use client";

import { useReceipt } from "@/contexts/ReceiptContext";
import type { ReceiptItem, Coupon } from "@/contexts/ReceiptContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Receipt,
  Calendar,
  CreditCard,
  ArrowLeft,
  Plus,
  Users,
  DollarSign,
} from "lucide-react";
import { FormDialog } from "@/components/shared/form-dialog";

export default function ItemizedListPage() {
  const router = useRouter();
  const { parsedReceipt } = useReceipt();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [numPeople, setNumPeople] = useState(0);
  const [splitResult, setSplitResult] = useState<{
    type: "even" | "item";
    perPerson?: number;
    numPeople?: number;
  } | null>(null);

  useEffect(() => {
    if (!parsedReceipt) {
      router.push("/upload-receipt");
    }
  }, [parsedReceipt]);

  if (!parsedReceipt) {
    return (
      <div className="size-full flex items-center justify-center">
        <div>Redirecting...</div>
      </div>
    );
  }

  const { generatedContent } = parsedReceipt;
  const {
    date_time,
    items,
    coupons,
    tax,
    tips,
    subtotal,
    total,
    payment_method,
  } = generatedContent;

  // Format date
  const formattedDate = new Date(date_time).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="size-full flex flex-col items-center justify-center">
      <div className="container mx-auto p-6 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => router.push("/upload-receipt")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Upload
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-6 w-6" />
              Receipt Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date and Payment Method */}
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>{payment_method}</span>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Items</h3>
              </div>
              <div className="space-y-2">
                {items.map((item: ReceiptItem, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      {item.quantity > 1 && (
                        <span className="text-sm text-muted-foreground ml-2">
                          × {item.quantity}
                        </span>
                      )}
                    </div>
                    <span className="font-medium">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupons (if any) */}
            {coupons.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Coupons</h3>
                  <div className="space-y-2">
                    {coupons.map((coupon: Coupon, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-green-600"
                      >
                        <span>{coupon.name}</span>
                        <span>-${coupon.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              )}
              {tips > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tips</span>
                  <span>${tips.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1"
                onClick={() => router.push("/itemized-list/split-by-item")}
              >
                Split by Item
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => setDialogOpen(true)}
              >
                Split Evenly
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Split Evenly Dialog */}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Split Evenly"
        description="How many people are sharing this bill? Each person will pay the same amount."
        fieldLabel="Number of People"
        fieldPlaceholder="Enter number of people"
        fieldValue={numPeople.toString()}
        onFieldChange={(value) => setNumPeople(parseInt(value, 10) || 0)}
        onConfirm={() => {
          const perPerson = total / numPeople;
          setSplitResult({ type: "even", perPerson, numPeople });
        }}
        confirmDisabled={numPeople <= 0}
      />
      {/* Split Result for Even Split */}
      {splitResult && splitResult.type === "even" && (
        <div className="container mx-auto px-6 max-w-2xl mb-6">
          <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Users className="h-5 w-5" />
                Split Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount per person - Large display */}
              <div className="text-center py-6 px-4 bg-white dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-muted-foreground mb-2">
                  Each person pays
                </p>
                <div className="flex items-center justify-center gap-2">
                  <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <p className="text-5xl font-bold text-green-600 dark:text-green-400">
                    {splitResult.perPerson?.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Summary details */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-white dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Number of People
                  </p>
                  <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
                    {splitResult.numPeople}
                  </p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Bill</p>
                  <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
                    ${total.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Action button */}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setSplitResult(null)}
              >
                Clear Result
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
