import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// --- //

const isAuthenticated = asyncHandler(async function (req, res, next) {
  // console.log("in auth middleware");

  let accessJWT =
    req.cookies?.accessJWT ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!accessJWT)
    throw new ErrorHandler(
      401,
      "Unauthorized request, may be you have to login!"
    );

  let payload = jsonwebtoken.verify(accessJWT, process.env.ACCESS_JWT_SECRET);
  // console.log("payload:", payload);

  let user = await User.findById(payload?._id).select(
    "-password -refreshToken"
  );
  if (!user)
    throw new ErrorHandler(
      401,
      "Unauthorized request, may be you have to login!"
    );

  req.user = user;

  // console.log("req.user:", req.user);

  next();
});

export { isAuthenticated };
