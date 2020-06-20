module.exports = {
    client: {
        service: {
            name: 'giftbox',
            url: 'http://localhost:5000/graphql',

            // optional headers
            // headers: {},
            // optional disable SSL validation check
            // skipSSLValidation: true,
        },
        includes: ['./src/**/*.ts*'],
        excludes: ['./src/generated/graphql.tsx'],
    },
}
