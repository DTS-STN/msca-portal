import type { AlertType } from "~/components/contextual-alert";

/**
 * @param alertTypeString - the string of alert type to map
 * @param nullAlertTypeStringMapping- the type to return if a null alertTypeString is supplied; defaults to 'info'
 * @returns the "info" | "success" | "danger" | "warning" which is consumed by the ContextualAlert component
 */
export function getContextualAlertType(alertTypeString: string | null, nullAlertTypeStringMapping: AlertType = 'info'): AlertType {
  if (alertTypeString === null) {
    return nullAlertTypeStringMapping;
  }

  switch (alertTypeString) {
    case "danger": {
      return 'danger';
    }
    case "warning": {
      return 'warning'
    }
    default: {
      return 'info';
    }
  }
}