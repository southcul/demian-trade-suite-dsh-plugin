window.__ModuleLoader__.load({
  id: 'dsh-plugin-demian-trade-suite',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'demian-trade-suite';
    const PANEL_ID = 'demian-trade-suite';
    const WORKBENCH_URL = '/plugins/demian-trade-suite/workbench.html';

    const zh = {
      'panel.label': '外贸工作台',
      'page.title': '外贸单证与装柜工作台',
    };
    const en = {
      'panel.label': 'Trade Desk',
      'page.title': 'Trade Documents & Loading',
    };

    function Icon({ size = 16 }) {
      return h('svg', {
        viewBox: '0 0 16 16',
        width: size,
        height: size,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.25,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        'data-dsh-panel-entry': PANEL_ID,
      },
        h('path', { d: 'M2.5 2.4h8.1v11.2H2.5z' }),
        h('path', { d: 'M4.4 5.1h4.3M4.4 7.2h4.3M4.4 9.3h2.5' }),
        h('path', { d: 'M10.9 5.4h2.6v8.2h-5' }),
        h('path', { d: 'M11.1 8.1h1.2M11.1 10h1.2' })
      );
    }

    function WorkbenchPage() {
      return h('div', {
        style: {
          height: '100%',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--dsw-alias-bg, #f3efe7)',
        },
      }, h('iframe', {
        src: WORKBENCH_URL,
        title: '外贸单证与装柜工作台',
        allow: 'clipboard-read; clipboard-write',
        allowFullScreen: true,
        style: {
          width: '100%',
          height: '100%',
          flex: '1 1 auto',
          minHeight: 0,
          border: 0,
          display: 'block',
          background: '#f3efe7',
        },
      }));
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        let t = (key) => (zh[key] ?? en[key] ?? key);
        ctx.effect(() => {
          try {
            return ctx.locale.register(NS, { zh, en });
          } catch {
            return () => {};
          }
        }, 'demian-trade-suite:dictionaries');
        try {
          t = ctx.locale.bind(NS);
        } catch {}

        const disposers = [];
        disposers.push(ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: 6,
          label: () => t('panel.label'),
        }, Icon)));
        disposers.push(ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: PANEL_ID,
        }, WorkbenchPage)));
        return () => {
          for (const dispose of disposers.splice(0)) dispose();
        };
      },
    };
  },
});
