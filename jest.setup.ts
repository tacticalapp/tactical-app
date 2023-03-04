Object.defineProperty(global, "crypto", {
    value: {
        subtle: require('crypto').webcrypto.subtle,
        getRandomValues: (arr: Buffer) => require('crypto').randomBytes(arr.length)
    },
});
export { };