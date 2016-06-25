//         '.*/mobile/authenticate': 'http://localhost:8080/api/authenticate',
//         '.*/mobile': 'http://localhost:8080/api/mobile',
//         '.*/cupom': 'http://localhost:8081/',
//         '.*/fluxo': 'http://localhost:8082/'

const ruleset = {
  rules: [
    {
      matches: {
        path: { value: '/mobile' },
      },
      proxy: {
        enabled: true,
        changeOrigin: true,
        target: 'http://localhost:8080/',
      },
    },
    {
      matches: {
        path: { value: '/cupom' },
      },
      proxy: {
        enabled: true,
        changeOrigin: true,
        target: 'http://localhost:8081/',
      },
    },
    {
      matches: {
        path: { value: '/fluxo' },
      },
      proxy: {
        enabled: true,
        changeOrigin: true,
        target: 'http://localhost:8082/',
      },
    },
    // {
    //   matches: {
    //     path: { value: '/lkjlkj' },
    //   },
    //   password: {
    //     enabled: true,
    //     clientId: 2,
    //     clientSecret: 'adasd',
    //   },
    // },
    // {
    //   matches: {
    //     path: { pattern: '^\/api(\/.*)$' },
    //   },
    //   oauth2: {
    //     enabled: true,
    //   },
    //   proxy: {
    //     enabled: true,
    //     changeOrigin: true,
    //     target: 'http://www.sebraeinteligenciasetorial.com.br',
    //   },
    // },
    // {
    //   matches: {
    //     path: { pattern: '^\/google(|\/.*)$' },
    //   },
    //   proxy: {
    //     enabled: true,
    //     changeOrigin: true,
    //     autoRewrite: true,
    //     target: 'https://www.google.com.br',
    //   },
    // },
    // {
    //   matches: {
    //     path: { pattern: '^\/sebrae(\/.*)$' },
    //     host: { value: 'localhost' },
    //   },
    //   oauth2: {
    //     enabled: true,
    //     whitelist: [ '10.2.1.3' ],
    //   },
    //   login: {
    //     enabled: true,
    //     clientId: 2,
    //     clientSecret: '49e381a17af74897b13f4365c74ff336',
    //     custom: {
    //       title: 'hello world',
    //     },
    //   },
    //   headers: {
    //     enabled: true,
    //     add: {
    //       'x-client-name': 'hello world',
    //     },
    //     remove: ['authorization'],
    //   },
    //   proxy: {
    //     enabled: true,
    //     target: 'http://127.0.0.1:3001/abc',
    //   },
    // },
    // {
    //   matches: {
    //     host: { value: 'localhost' },
    //   },
    //   proxy: {
    //     enabled: true,
    //     changeOrigin: true,
    //     autoRewrite: true,
    //     target: 'https://www.google.com.br',
    //   },
    // },
  ],
}

export default ruleset;
