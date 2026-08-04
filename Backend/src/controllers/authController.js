const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * POST /api/auth/google
 * The React frontend uses @react-oauth/google to get an ID token from Google,
 * then sends that token here. We verify it's genuinely from Google, then
 * find-or-create the matching User, and issue our OWN JWT for future requests.
 */
async function googleLogin(req, res, next) {
  try {
    const { credential } = req.body; // the Google ID token from the frontend

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    // Verify the token is real and actually issued for our app
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find existing user, or create a new one on first login
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
      });
    } else if (!user.googleId) {
      // edge case: user existed without a googleId linked yet
      user.googleId = googleId;
      await user.save();
    }

    if (user.blocked) {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Returns the currently logged-in user's info. Used on app load
 * to check "am I still logged in" and restore the session.
 */
async function getMe(req, res) {
  res.status(200).json({ user: req.user });
}

module.exports = { googleLogin, getMe };
