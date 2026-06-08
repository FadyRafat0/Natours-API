import fs from 'fs/promises';

export const removeUserPhoto = async (userPath) => {
    // dont need to delay the response so let it go asny
    fs.unlink(`public/img/users/${userPath}`).catch((err) =>
        console.log('Cannot remove the old photo', err),
    );
};

export const removeTourPhoto = async (tourPath) => {
    // dont need to delay the response so let it go asny
    fs.unlink(`public/img/tours/${tourPath}`).catch((err) =>
        console.log('Cannot remove the old photo', err),
    );
};
