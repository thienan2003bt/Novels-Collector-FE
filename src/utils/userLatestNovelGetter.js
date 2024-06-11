
const USER_LOCAL_STORAGE_KEY = 'userLatestNovel';
const MAX_NOVELS = 10;
const CUSTOM_USER_STORAGE_EXPIRE_TIME_IN_DAYS = parseInt(7 * 24 * 60 * 60 * 1000); //7 days

const validateNovel = (novel) => {
    return {
        source: novel?.source,
        novelSlug: novel?.slug,
        cover: novel?.cover,
        title: novel?.title,
        chapter: {
            id: novel?.chapterID,
            slug: novel?.chapterSlug,
            number: novel?.chapterNumber,
        }
    }
}

const setItemWithExpiration = (key, value, ttl) => {
    const now = new Date();
    const item = {
        value: value,
        expiredAt: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
};

const getItemWithExpiration = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiredAt) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
};



const getUserLatestNovels = () => {
    const novels = getItemWithExpiration(USER_LOCAL_STORAGE_KEY);
    return novels ? novels : [];
}

const saveNovelToUserStorage = (newNovel) => {
    let savedNovel = validateNovel(newNovel);

    const novels = getUserLatestNovels();
    const novelIndex = novels.findIndex(n => n.novelSlug === savedNovel.novelSlug);

    if (novelIndex !== -1) {
        if (!savedNovel?.chapter?.slug) {
            console.log('Add new novel into user latest novel');
            savedNovel.chapter = novels[novelIndex].chapter;
        }
        novels.splice(novelIndex, 1);
    }

    novels.unshift(savedNovel);

    if (novels.length > MAX_NOVELS) {
        novels.pop();
    }


    setItemWithExpiration(USER_LOCAL_STORAGE_KEY, novels, CUSTOM_USER_STORAGE_EXPIRE_TIME_IN_DAYS);
    return novels;
}

const removeNovelFromUserStorage = (novelSlug) => {
    let novels = getUserLatestNovels();

    const novelIndex = novels.findIndex(n => n.novelSlug === novelSlug);

    if (novelIndex !== -1) {
        novels.splice(novelIndex, 1);
        setItemWithExpiration(USER_LOCAL_STORAGE_KEY, novels, CUSTOM_USER_STORAGE_EXPIRE_TIME_IN_DAYS);
    }

    return novels;
}

const UserLatestNovelGetter = {
    getUserLatestNovels,
    saveNovelToUserStorage,
    removeNovelFromUserStorage,
}

export default UserLatestNovelGetter;