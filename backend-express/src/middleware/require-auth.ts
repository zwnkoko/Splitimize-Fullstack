import { auth } from "@/lib/auth";

export async function requireAuth(req: any, res: any, next: any) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = session.user;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid session" });
  }
}
