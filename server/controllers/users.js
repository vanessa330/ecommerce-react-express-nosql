import User from "../models/User.js";

/* READ */

export const getUser = async (req, res) => {
  // URL/users/:id
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
};

export const getUserFollowers = async (req, res) => {
  // URL/users/:id/followers
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const followers = await Promise.all(
      user.followers.map((id) => User.findById(id))
    );

    const formattedfollowers = followers.map(
      ({ _id, firstName, lastName, picturePath, followers, following }) => {
        return { _id, firstName, lastName, picturePath, followers, following };
      }
    );

    res.status(200).json(formattedfollowers);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
};

export const getUserFollowing = async (req, res) => {
  // URL/users/:id/following
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const following = await Promise.all(
      user.following.map((id) => User.findById(id))
    );

    const formattedFollowing = following.map(
      ({ _id, firstName, lastName, picturePath, followers, following }) => {
        return { _id, firstName, lastName, picturePath, followers, following };
      }
    );

    res.status(200).json(formattedFollowing);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
};

/* UPDATE */

export const addRemoveFollowing = async (req, res) => {
  // URL/users/:id/:followingId
  try {
    const { id, followingId } = req.params;
    const user = await User.findById(id);
    const oppositeUser = await User.findById(followingId);

    if (!user.following.includes(followingId) && user._id != followingId) {
      user.following.push(followingId);
      oppositeUser.followers.push(id);
    } else if (user.following.includes(followingId)) {
      user.following = user.following.filter((id) => id !== followingId);
      oppositeUser.followers = oppositeUser.followers.filter((id) => id !== id);
    }

    await user.save();
    await oppositeUser.save();

    // Updated user's following list and return to frontend.
    const updatedFollowing = await Promise.all(
      user.following.map((id) => User.findById(id))
    );

    const formattedfollowing = updatedFollowing.map(
      ({ _id, firstName, lastName, picturePath, followers, following }) => {
        return {
          _id,
          firstName,
          lastName,
          picturePath,
          followers,
          following,
        };
      }
    );

    res.status(200).json(formattedfollowing);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
};
