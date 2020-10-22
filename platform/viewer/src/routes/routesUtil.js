import asyncComponent from '../components/AsyncComponent.js';

import OHIF from '@ohif/core';
const { urlUtil: UrlUtil } = OHIF.utils;

// Dynamic Import Routes (CodeSplitting)
const IHEInvokeImageDisplay = asyncComponent(() =>
  import(
    /* webpackChunkName: "IHEInvokeImageDisplay" */ './IHEInvokeImageDisplay.js'
  )
);
const ViewerRouting = asyncComponent(() =>
  import(/* webpackChunkName: "ViewerRouting" */ './ViewerRouting.js')
);

const RapidViewerRouting = asyncComponent(() =>
  import(/* webpackChunkName: "ViewerRouting" */ '../viewer/ViewerRouting.js')
);
const StudyListRouting = asyncComponent(() =>
  import(
    /* webpackChunkName: "StudyListRouting" */ '../studylist/StudyListRouting.js'
  )
);
const StandaloneRouting = asyncComponent(() =>
  import(
    /* webpackChunkName: "ConnectedStandaloneRouting" */ '../connectedComponents/ConnectedStandaloneRouting.js'
  )
);
const XNATStandaloneRouting = asyncComponent(() =>
  import(
    /* webpackChunkName: "ConnectedXNATStandaloneRouting" */ '../connectedComponents/ConnectedXNATStandaloneRouting.js'
  )
);
const ViewerLocalFileData = asyncComponent(() =>
  import(
    /* webpackChunkName: "ViewerLocalFileData" */ '../connectedComponents/ViewerLocalFileData.js'
  )
);

const XnatLogin = asyncComponent(() =>
  import(
    /* webpackChunkName: "XnatLogin" */ '@ohif/extension-rapid-viewer/src/components/XnatLogin.js'
  )
);
const WorkListRouting = asyncComponent(() =>
  import(
    /* webpackChunkName: "WorkListRouting" */ '../worklist/WorkListRouting.js'
  )
);
const reload = () => window.location.reload();

// Define XNAT Route based on URL/Context configuration
const xnatRoute = () => {
  const href = window.location.href;
  const origin = window.location.origin;
  let xnatRoute = href.split('/VIEWER')[0];

  xnatRoute = xnatRoute.replace(origin, '');
  xnatRoute += '/VIEWER';
  return xnatRoute;
};

const ROUTES_DEF = {
  default: {
    viewer: {
      path: '/viewer/:studyInstanceUIDs',
      component: ViewerRouting,
    },
    rapidViewer: {
      path: '/rapid-viewer/:workListId',
      component: RapidViewerRouting,
    },
    // standaloneViewer: {
    //   path: '/sa_viewer',
    //   component: StandaloneRouting,
    // },
    XNATstandaloneViewer: {
      path: xnatRoute(),
      component: XNATStandaloneRouting,
    },
    list: {
      path: ['/studylist'],
      component: StudyListRouting,
      condition: appConfig => {
        return appConfig.showStudyList;
      },
    },
    local: {
      path: '/local',
      component: ViewerLocalFileData,
    },
    // IHEInvokeImageDisplay: {
    //   path: '/IHEInvokeImageDisplay',
    //   component: IHEInvokeImageDisplay
    // },
    xnatLogin: {
      path: ['/login'],
      component: XnatLogin,
    },
    workList: {
      path: ['/worklist', '/'],
      component: WorkListRouting,
    },
  },
  gcloud: {
    viewer: {
      path:
        '/projects/:project/locations/:location/datasets/:dataset/dicomStores/:dicomStore/study/:studyInstanceUIDs',
      component: ViewerRouting,
      condition: appConfig => {
        return !!appConfig.enableGoogleCloudAdapter;
      },
    },
    list: {
      path:
        '/projects/:project/locations/:location/datasets/:dataset/dicomStores/:dicomStore',
      component: StudyListRouting,
      condition: appConfig => {
        const showList = appConfig.showStudyList;

        return showList && !!appConfig.enableGoogleCloudAdapter;
      },
    },
  },
};

const getRoutes = appConfig => {
  const routes = [];
  for (let keyConfig in ROUTES_DEF) {
    const routesConfig = ROUTES_DEF[keyConfig];

    for (let routeKey in routesConfig) {
      const route = routesConfig[routeKey];
      const validRoute =
        typeof route.condition === 'function'
          ? route.condition(appConfig)
          : true;

      if (validRoute) {
        routes.push({
          path: route.path,
          Component: route.component,
        });
      }
    }
  }

  return routes;
};

const parsePath = (path, server, params) => {
  let _path = path;
  const _paramsCopy = Object.assign({}, server, params);

  for (let key in _paramsCopy) {
    _path = UrlUtil.paramString.replaceParam(_path, key, _paramsCopy[key]);
  }

  return _path;
};

const parseViewerPath = (appConfig = {}, server = {}, params) => {
  let viewerPath = ROUTES_DEF.default.viewer.path;
  if (appConfig.enableGoogleCloudAdapter) {
    viewerPath = ROUTES_DEF.gcloud.viewer.path;
  }

  return parsePath(viewerPath, server, params);
};

const parseStudyListPath = (appConfig = {}, server = {}, params) => {
  let studyListPath = ROUTES_DEF.default.list.path;
  if (appConfig.enableGoogleCloudAdapter) {
    studyListPath = ROUTES_DEF.gcloud.list.path || studyListPath;
  }

  return parsePath(studyListPath, server, params);
};

export { getRoutes, parseViewerPath, parseStudyListPath, reload };
