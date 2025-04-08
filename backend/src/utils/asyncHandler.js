// 1)
export function asyncHandler(reqHandlerFunc) {
  return async (req, res, next) => {
    Promise.resolve(reqHandlerFunc(req, res, next)).catch((error) =>
      next(error)
    );
  };
}

// 2)
// export const asyncHandler = (reqHandlerFunc) => {return async(req, res, next) => {}};

// 3)
// export const asyncHandler = (reqHandlerFunc) => async (req, res, next) => {
//   try {
//     await reqHandlerFunc(req, res, next);
//   } catch (error) {
//     res.status(error.code).json({ success: false, message });
//   }
// };
