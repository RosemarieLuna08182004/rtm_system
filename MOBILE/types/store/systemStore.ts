import { APP_MANAGER } from "@/constants"
import { Manager } from "./manager"

export interface SystemStore {
  [APP_MANAGER]: Manager
}
