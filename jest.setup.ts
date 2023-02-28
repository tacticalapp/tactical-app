Object.defineProperty(global, "crypto", {
    value: {
        subtle: require('crypto').webcrypto.subtle,
    },
});
export { };