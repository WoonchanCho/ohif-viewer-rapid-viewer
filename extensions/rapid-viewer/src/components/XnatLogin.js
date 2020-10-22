import React, { useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import './XnatLogin.css';
import { useSelector, useDispatch } from 'react-redux';
import User from '../dao/user';
import actions from '../redux/actions';
import { fetchPluginCheck, fetchTokenIssue } from '../fetch';
import { PageNotFoundException, HttpException } from '../exception';
import { ErrorMessages } from '../constants';
import { getRecentLoginInfo, saveLoginInfo } from '../utils';

function XnatLogin() {
  let loginInfo = getRecentLoginInfo();
  if (!loginInfo.xnatUrl && process.env.NODE_ENV === 'development') {
    loginInfo.xnatUrl = `${location.protocol}//${location.host}${process.env.XNAT_PROXY}`;
  }

  const { xnatUrl: defaultXnatUrl, username: defautUsername } = loginInfo;

  const isLoggedIn = useSelector(state => state.authentication.isLoggedIn);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [xnatUrl, setXnatUrl] = useState(defaultXnatUrl);
  const [username, setUsername] = useState(defautUsername);
  const [password, setPassword] = useState();

  const passwordRef = useRef();

  function isLoading() {
    return loading;
  }

  function validateForm() {
    return (
      xnatUrl &&
      xnatUrl.length > 0 &&
      username &&
      username.length > 0 &&
      password &&
      password.length > 0
    );
  }

  function adjustUrl(url) {
    if (!/^https?:\/\//i.test(url)) {
      return 'https://' + url;
    }
    return url;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      if (!validateForm()) {
        throw new Error('Required fields are not provided.');
      }
      const adjustedUrl = adjustUrl(xnatUrl);
      setXnatUrl(adjustedUrl);
      const user = await login(adjustedUrl, username, password);
      await postLoginCheck(user);
      saveLoginInfo(user.xnatUrl, username);
      await dispatch(actions.setUser(user));
    } catch (error) {
      showSnackbar('Login Error', error.message);
      setLoading(false);
    }
    // setLoading(false);
  }

  function showSnackbar(title, message) {
    window.snackbar.show({ title, message, type: 'error' });
  }

  async function login(xnatUrl, username, password) {
    try {
      // const _sessionId = await fetchLogin(xnatUrl, username, password);
      const tokenObject = await fetchTokenIssue(xnatUrl, username, password);
      const user = new User(
        xnatUrl,
        tokenObject.xdatUserId, //username
        '', // email
        '', // first name
        '', // last name
        tokenObject.alias,
        tokenObject.secret,
        tokenObject.estimatedExpirationTime,
        tokenObject.timestamp
      );
      return user;
    } catch (error) {
      if (
        error instanceof HttpException ||
        error instanceof PageNotFoundException
      ) {
        throw new Error(ErrorMessages.INVALID_XNAT_URL);
      } else {
        throw error;
      }
    }
  }

  async function postLoginCheck(user) {
    try {
      await fetchPluginCheck(user);
    } catch (error) {
      if (error instanceof PageNotFoundException) {
        throw new Error(
          ErrorMessages.RAPID_VIEWER_PLUGIN_NOT_INSTALLED + ' ' + user.xnatUrl
        );
      } else {
        throw error;
      }
    }
  }

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>XNAT URL</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={xnatUrl}
            onChange={e => setXnatUrl(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>USER</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>PASSWORD</ControlLabel>
          <FormControl
            ref={passwordRef}
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button disabled={!validateForm() || isLoading()} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}

function FormGroup(props) {
  return <div className="FormGroup">{props.children}</div>;
}

FormGroup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
};

function ControlLabel(props) {
  return <span className="ControlLabel">{props.children}</span>;
}

ControlLabel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
};

function FormControl(props) {
  return <input className="Input" {...props} />;
}
FormControl.propTypes = {
  type: PropTypes.string,
};

function Button(props) {
  const { children, ...remProps } = props;
  return <button {...remProps}>{children}</button>;
}

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
};

export default XnatLogin;
