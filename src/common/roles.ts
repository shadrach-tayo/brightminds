// eslint-disable-next-line @typescript-eslint/no-var-requires
const AccessControl = require('accesscontrol');
import { UserTypeEnum } from './UserTypeEnum';
const ac = new AccessControl();

const roles = (function () {
  ac.grant(UserTypeEnum.MEMBER).readOwn('profile').updateOwn('profile').createOwn('profile');

  ac.grant(UserTypeEnum.ADMIN).extend(UserTypeEnum.MEMBER).readAny('member').updateAny('member').deleteAny('member');

  ac.grant(UserTypeEnum.SUPER_ADMIN).extend(UserTypeEnum.ADMIN).deleteAny('admin').createAny('admin').updateAny('admin').updateAny('transaction');

  return ac;
})();

export default roles;
