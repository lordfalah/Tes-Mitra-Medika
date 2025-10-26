import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "./get-session";
import { Session, User } from "better-auth";

type Handler = (
  req: NextRequest & { auth: { session: Session; user: User } },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any,
) => Promise<Response>;

export function withAuth(handler: Handler): Handler {
  return async (req, context) => {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        {
          status: false,
          errors: null,
          message: "Unauthorized access",
        },
        { status: 401 },
      );
    }

    // If authenticated, call the original handler
    req.auth = { session: session.session, user: session.user };
    return handler(req, context);
  };
}
