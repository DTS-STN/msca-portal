import { requireAuth } from "~/.server/utils/auth-utils";
import { AppError } from "~/errors/app-error";
import { ErrorCodes } from "~/errors/error-codes";
import { Route } from "../routes/+types/intake";
import { Navigate } from "react-router";
import { getPathById } from "~/utils/route-utils";

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const { userinfoTokenClaims } = await requireAuth(context.session, request);

  // TODO: Properly handle not being logged in (ie. redirected from ECAS)
  if (!userinfoTokenClaims.sin) {
    throw new AppError('No SIN found in userinfo token', ErrorCodes.MISSING_SIN);
  }
  
  // ECAS and the apps redirect to the index with a search parameter of Lang=fra or Lang=eng
  const searchParams = new URL(request.url).searchParams
  const lang = searchParams.get("Lang")
  return { lang: lang };
}

export default function Intake({ loaderData, params }: Route.ComponentProps) {
  const lang = loaderData.lang

  if (!lang) {
    return (<Navigate to="/404"/>)
  }
  
  const decodedLang = lang === 'eng' ? 'en' : 'fr'
  const path = getPathById('my-dashboard', params = { lang: decodedLang });
  return (<Navigate to={path}/>)
}