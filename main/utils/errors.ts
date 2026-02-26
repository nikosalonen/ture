import path from 'node:path';
import {clipboard, shell, app} from 'electron';
import ensureError from 'ensure-error';
import cleanStack from 'clean-stack';
import macosRelease from './macos-release';

import {windowManager} from '../windows/manager';
import {InstalledPlugin} from '../plugins/plugin';

const ERRORS_TO_IGNORE = [
  /net::ERR_CONNECTION_TIMED_OUT/,
  /net::ERR_NETWORK_IO_SUSPENDED/,
  /net::ERR_CONNECTION_CLOSED/,
];

const shouldIgnoreError = (errorText: string) => ERRORS_TO_IGNORE.some(regex => regex.test(errorText));

const getPrettyStack = (error: Error) => {
  const pluginsPath = path.join(app.getPath('userData'), 'plugins', 'node_modules');
  return cleanStack(error.stack ?? '', {pretty: true, basePath: pluginsPath});
};

const release = macosRelease();

const getIssueBody = (title: string, errorStack: string) => `
<!--
Thank you for helping us test Kap. Your feedback helps us make Kap better for everyone!
-->

**macOS version:**    ${release.name} (${release.version})
**Kap version:**      ${app.getVersion()}

\`\`\`
${title}

${errorStack}
\`\`\`

<!-- If you have additional information, enter it below. -->
`;

export const showError = async (
  error: Error,
  {
    title: customTitle,
    plugin,
  }: {
    title?: string;
    plugin?: InstalledPlugin;
  } = {},
) => {
  await app.whenReady();
  const ensuredError = ensureError(error);
  const title = customTitle ?? ensuredError.name;
  const detail = getPrettyStack(ensuredError);

  console.log(error);
  if (shouldIgnoreError(`${title}\n${detail}`)) {
    return;
  }

  const mainButtons = [
    'Don\'t Report',
    {
      label: 'Copy Error',
      action() {
        clipboard.writeText(`${title}\n${detail}`);
      },
    },
  ];

  // If it's a plugin error, offer to open an issue on the plugin repo (if known)
  if (plugin) {
    const openIssueButton = plugin.repoUrl && {
      label: 'Open Issue',
      action() {
        const url = new URL(`${plugin.repoUrl}/issues/new`);
        url.searchParams.set('title', title);
        url.searchParams.set('body', getIssueBody(title, detail));
        shell.openExternal(url.toString());
      },
    };

    return windowManager.dialog?.open({
      title,
      detail,
      cancelId: 0,
      defaultId: openIssueButton ? 2 : 0,
      buttons: [...mainButtons, openIssueButton].filter(Boolean),
    });
  }

  const buttons: any[] = [
    ...mainButtons,
    {
      label: 'Open Issue',
      action() {
        const url = new URL('https://github.com/wulkano/kap/issues/new');
        url.searchParams.set('title', title);
        url.searchParams.set('body', getIssueBody(title, detail));
        shell.openExternal(url.toString());
      },
    },
  ];

  return windowManager.dialog?.open({
    title,
    detail,
    buttons,
    cancelId: 0,
    defaultId: 2,
  });
};

export const setupErrorHandling = () => {
  process.on('uncaughtException', error => {
    showError(error, {title: 'Unhandled Error'});
  });

  process.on('unhandledRejection', error => {
    showError(ensureError(error), {title: 'Unhandled Promise Rejection'});
  });
};
