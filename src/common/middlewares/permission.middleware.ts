import { RESOURCES } from '../enum';
import roles from '../roles';

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      if (Array.isArray(action)) {
        const permissions = action.map(act => roles.can(req.user.role)[act](resource));

        const isGranted = permissions.some(permission => !!permission.granted);

        if (!isGranted) {
          return res.status(403).json({
            status: 'error',
            message: 'Unauthorized access',
          });
        }
      } else {
        const permission = roles.can(req.user.role)[action](resource);

        if (!permission.granted) {
          return res.status(403).json({
            status: 'error',
            message: 'Unauthorized access',
          });
        }
      }
      console.log('verified', req.user.role);
      next();
    } catch (error) {
      res.status(401).json({
        status: 'error',
        message: error.message,
      });
    }
  };
};

// const isSameDeptOrCanEdit = (action, resource) => {
//   return async (req, res, next) => {
//     try {
//       const userDept = req.user.department;

//       const ticket: Ticket = await ticketModel.findOne({ ticketId: req.params.ticketId });
//       if (!ticket) throw new HttpException(400, 'Ticket not found');

//       if (userDept === ticket.assignedDept) return next();

//       const permission = roles.can(req.user.role)[action](resource);

//       if (permission.granted) return next();

//       return res.status(403).json({
//         status: 'error',
//         message: 'Unauthorized access',
//       });
//     } catch (error) {
//       res.status(401).json({
//         status: 'error',
//         message: error.message,
//       });
//     }
//   };
// };

const isSameUserOrAdmin = (action, resource: RESOURCES) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const updateId = req.params.id;

      if (userId === updateId) return next();

      const permission = roles.can(req.user.role)[action](resource);

      if (permission.granted) return next();

      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized access',
      });
    } catch (error) {
      res.status(401).json({
        status: 'error',
        message: error.message,
      });
    }
  };
};

// const isSameUser = (action, resource) => {
//   return async (req, res, next) => {
//     try {
//       const userId = req.user.id;

//       if (userId === updateId) return next();

//       const permission = roles.can(req.user.role)[action](resource);

//       if (permission.granted) return next();

//       return res.status(403).json({
//         status: 'error',
//         message: 'Unauthorized access',
//       });
//     } catch (error) {
//       res.status(401).json({
//         status: 'error',
//         message: error.message,
//       });
//     }
//   };
// };

const permissionMiddleWare = { grantAccess, isSameUserOrAdmin };
export default permissionMiddleWare;
