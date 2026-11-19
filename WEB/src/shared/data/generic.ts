import { Roles } from "../../types";
import _ from 'lodash';

export const accountTypeOpt = [
    {value:Roles.default, label:'Select Account Type'},
    // The backend only creates normal users; administrator accounts can't be added from here
    {value:Roles.user, label:Roles.user},
    //{value:Roles.moderator, label:Roles.moderator}
]

export const positionOpt = _.range(0, 12).map((position) => ({
  value: `${position}`,
  label: `${position}`,
}));