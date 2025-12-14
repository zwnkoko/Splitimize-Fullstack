import { auth } from "@/lib/auth";

export async function requireAuth(req: any, res: any, next: any) {
  try {
    // Check for demo mode header
    const isDemoMode = req.headers["x-demo-mode"] === "true";

    if (isDemoMode) {
      // Allow demo access with a special demo user object
      req.user = {
        id: "DEMO",
        name: "Demo User",
        email: "demo@splitimize.app",
        isDemo: true,
      };
      return next();
    }

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
