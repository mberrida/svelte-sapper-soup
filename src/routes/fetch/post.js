import axios from 'axios';

// external routes
const apiEndpoints = {
  register: 'open/register',
  login: 'open/login',
  newOrder: 'open/new-order',
  updateOrder: 'open/update-order',
  getUser: 'user/get-user',
  myOrders: 'user/my-orders',
  updateUser: 'user/update-user',
  myLatestOrder: 'user/my-latest-order',
  adminOrders: 'admin/orders',
  deleteOrder: 'admin/delete-order',
};

export async function post(req, res) {
  const action = req.headers._action || null;
  const url = req.headers._url || 'https://backend-soup.herokuapp.com/api';

  // external api call
  const endpoint = apiEndpoints[action] || null;

  console.log(action + '...', 'to ' + url);

  // return logout?
  if (action === 'logout') {
    return logout({ req, res, action });
  }

  if (!endpoint) {
    return res.end(
      JSON.stringify({
        status: 400,
        error: 'Bad request',
        msg: 'Missing valid action header',
      })
    );
  }

  // build req header
  const opts = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: req.session.token || null,
    },
  };

  // go
  let { data } = await axios.post(`${url}/${endpoint}`, req.body, opts);

  console.log(action + ' response status', data.status, data.msg);

  if (data.error) console.error(action + ' ERROR:', data.error, data.msg || '');

  // update session
  const syncSession = action === 'register' || action === 'login';

  if (syncSession) {
    req.session.user = data.user;
    req.session.token = data.token;
    req.session.tokenExists = !!data.token;
  }

  if (action === 'updateUser') req.session.user = data.user;

  const { user, tokenExists } = req.session;

  // get back
  res.setHeader('Content-Type', 'application/json');

  res.end(
    JSON.stringify({
      ...data,
      tokenExists,
      token: tokenExists ? '(lives on server)' : null,
      user,
      action,
    })
  );
}

function logout({ req, res, action }) {
  // clear auth state in session

  req.session.user = null;
  req.session.token = null;
  req.session.tokenExists = false;

  const { user, tokenExists } = req.session;

  // hard get back
  res.end(
    JSON.stringify({
      status: 200,
      error: null,
      ok: true,
      msg: 'Successfully logged out in session',
      action,
      user,
      tokenExists,
    })
  );
}
