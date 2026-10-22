import { Roles } from "../../types";
import _ from 'lodash';

export const accountTypeOpt = [
    {value:Roles.default, label:'Select Account Type'},
    {value:Roles.encoder, label:Roles.encoder},
    {value:Roles.admin, label:Roles.admin},
    //{value:Roles.moderator, label:Roles.moderator}
]

export const positionOpt = _.range(0, 12).map((position) => ({
  value: `${position}`,
  label: `${position}`,
}));