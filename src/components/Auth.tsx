import React, {useState} from "react";
import styles from "./Auth.module.css";
import {useSelector, useDispatch} from "react-redux";
import {auth, provider, db, storage} from "../firebase";
import {login, updateProfile} from "../redux/userSlice";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AndroidRoundedIcon from "@material-ui/icons/AndroidRounded";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ContactMail from "@material-ui/icons/ContactMail";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {
  Link,
  Grid,
  CssBaseline,
  Paper,
  Avatar,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/shuji-takeda/chat-tool">
        @takeshu
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const Auth: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const onChangeImageHnadler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  //Email-Password Sign In
  const signInEmailPassword = async () => {
    await auth.signInWithEmailAndPassword(email, password).catch((err) => {
      alert(err.message);
    });
  };

  //Google Sign In
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(provider).catch((err) => {
      alert(err.message);
    });
  };

  //Sign Up
  const signUpEmailPassword = async () => {
    const authUser = await auth
      .createUserWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));
    var url;
    console.log(authUser);
    if (avatarImage) {
      //重複したアップロード対策として、一意な文字列を付加してUpload
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
      const N = 16;
      const random = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = random + "_" + avatarImage.name;
      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      url = await storage.ref("avatars").child(fileName).getDownloadURL();
    }
    if (authUser) {
      await authUser.user?.updateProfile({
        displayName: userName,
        photoURL: url,
      });
    }
    dispatch(
      updateProfile({
        userName: userName,
        avatarImage: url,
      })
    );
  };

  //Reset password
  const resetPassword = async () => {
    await auth.sendPasswordResetEmail(email);
    setOpenModal(!openModal);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Typography>
          <form className={classes.form} noValidate>
            {isSignUp && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="uerName"
                  label="userName"
                  name="userName"
                  autoComplete="userName"
                  autoFocus
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
                <Box textAlign="center">
                  <IconButton>
                    <label>
                      <AccountCircleIcon
                        fontSize="large"
                        className={
                          avatarImage
                            ? styles.login_addIconLoaded
                            : styles.login_addIcon
                        }
                      />
                      <input
                        className={styles.login_hiddenIcon}
                        type="file"
                        onChange={onChangeImageHnadler}
                      />
                    </label>
                  </IconButton>
                </Box>
              </>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Button
              disabled={!email || password.length < 6}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              startIcon={<ContactMail />}
              onClick={
                isSignUp
                  ? async () => await signUpEmailPassword()
                  : async () => await signInEmailPassword()
              }
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <Grid container>
              <Grid item xs>
                <span
                  onClick={() => setOpenModal(!openModal)}
                  className={styles.login_reset}
                >
                  Forgot password?
                </span>
              </Grid>
              <Grid item>
                <span
                  onClick={() => setIsSignUp(!isSignUp)}
                  className={styles.login_toggleMode}
                >
                  Don't have an account? Sign Up
                </span>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              startIcon={<AndroidRoundedIcon />}
              onClick={signInWithGoogle}
            >
              Sign In with Google
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
          <Dialog
            open={openModal}
            onClose={() => setOpenModal(!openModal)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Resetting</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter your email address.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenModal(!openModal)}
                color="secondary"
              >
                Cancel
              </Button>
              <Button onClick={resetPassword} color="secondary">
                Transmit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Grid>
    </Grid>
  );
};

export default Auth;
