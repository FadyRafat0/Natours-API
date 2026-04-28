export default (fn) => {
    return (req, res, next) => {
        // SO HERE IS MY FUNCTION BEING CALLED
        fn(req, res, next).catch(next);
    };
};
