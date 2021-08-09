import React, {useState} from "react";
import styles from "./TweetInput.module.css";
import {useSelector} from "react-redux";
import {selectUser, updateProfile} from "../redux/userSlice";
import {auth, storage, db} from "../firebase";
import {Avatar, Button, IconButton} from "@material-ui/core";
import firebase from "firebase/app";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

const Tweet: React.FC = () => {
  const user = useSelector(selectUser);

  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, settweetMsg] = useState("");

  const onChangeImageHnadler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    //form でonsubmitされると自動でリフレッシュされるので、それを防ぐ
    e.preventDefault();
    if (tweetImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + tweetImage.name;
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(tweetImage);
      uploadTweetImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,

        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection("posts").add({
                avatar: user.avatarImage,
                image: url,
                text: tweetMsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userName: user.userName,
              });
            });
        }
      );
    } else {
      db.collection("posts").add({
        avatar: user.avatarImage,
        image: "",
        text: tweetMsg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userName: user.userName,
      });
      setTweetImage(null);
      settweetMsg("");
    }
  };
  return (
    <>
      <form onSubmit={sendTweet}>
        <div className={styles.tweet_form}>
          <Avatar
            className={styles.tweet_avatar}
            src={user.avatarImage}
            onClick={async () => {
              await auth.signOut();
            }}
          />
          <input
            className={styles.tweet_input}
            placeholder="What's happening?"
            type="text"
            autoFocus
            value={tweetMsg}
            onChange={(e) => settweetMsg(e.target.value)}
          />
          <IconButton>
            <label>
              <AddAPhotoIcon
                className={
                  tweetImage
                    ? styles.tweet_addIconLoaded
                    : styles.tweet_addIconLoaded
                }
              />
              <input
                className={styles.tweet_hiddenIcon}
                type="file"
                onChange={onChangeImageHnadler}
              />
            </label>
          </IconButton>
        </div>
        <Button
          type="submit"
          disabled={!tweetMsg}
          className={
            tweetMsg ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
          }
        >
          Tweet
        </Button>
      </form>
    </>
  );
};

export default Tweet;
