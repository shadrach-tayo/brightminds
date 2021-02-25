// eslint-disable-next-line @typescript-eslint/no-var-requires
const AccessControl = require('accesscontrol');
import { RESOURCES } from './enum';
import { UserTypeEnum } from './UserTypeEnum';
const ac = new AccessControl();
// plans, invoice, events, reminders, competitions, subscriptions
const roles = (function () {
  ac.grant(UserTypeEnum.MEMBER)
    .readOwn(RESOURCES.PROFILE)
    .updateOwn(RESOURCES.PROFILE)
    .createOwn(RESOURCES.PROFILE)
    .createOwn(RESOURCES.SUBSCRIPTION)
    .readOwn(RESOURCES.SUBSCRIPTION)
    .readAny(RESOURCES.EVENTS)
    .createOwn(RESOURCES.REMINDERS)
    .updateOwn(RESOURCES.REMINDERS)
    .deleteOwn(RESOURCES.REMINDERS)
    .readAny(RESOURCES.COMPETITION);

  ac.grant(UserTypeEnum.ADMIN)
    .extend(UserTypeEnum.MEMBER)
    .readAny(RESOURCES.MEMBER)
    .updateAny(RESOURCES.MEMBER)
    .deleteAny(RESOURCES.MEMBER)
    .createAny(RESOURCES.SUBSCRIPTION)
    .readAny(RESOURCES.SUBSCRIPTION)
    .updateAny(RESOURCES.SUBSCRIPTION)
    .createAny(RESOURCES.COMPETITION)
    .updateAny(RESOURCES.COMPETITION)
    .deleteAny(RESOURCES.COMPETITION)
    .createAny(RESOURCES.PLANS)
    .readAny(RESOURCES.PLANS)
    .updateAny(RESOURCES.PLANS)
    .deleteAny(RESOURCES.PLANS)
    .createAny(RESOURCES.EVENTS)
    .updateAny(RESOURCES.EVENTS)
    .deleteAny(RESOURCES.EVENTS)
    .updateAny(RESOURCES.REMINDERS)
    .deleteAny(RESOURCES.REMINDERS);

  ac.grant(UserTypeEnum.SUPER_ADMIN)
    .extend(UserTypeEnum.ADMIN)
    .deleteAny(RESOURCES.ADMIN)
    .createAny(RESOURCES.ADMIN)
    .updateAny(RESOURCES.ADMIN)
    .deleteAny(RESOURCES.SUBSCRIPTION)
    .updateAny('transaction');

  return ac;
})();

export default roles;
