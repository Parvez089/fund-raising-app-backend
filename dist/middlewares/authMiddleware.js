/** @format */
import jwt from "jsonwebtoken";
export const verifyAdmin = (req, res, next) => {
    const token = req.cookies.token; // token from cookies
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded; // user data from token
        next();
    }
    catch (error) {
        res.status(403).json({ message: "Invalid Token" });
    }
};
//# sourceMappingURL=authMiddleware.js.map