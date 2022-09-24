import Cookies from 'universal-cookie'

const cookies = new Cookies()

export const setAccessToken = (token) => {
    const currrent = new Date()
    const nextDay = new Date()
    nextDay.setDate(currrent.getDate() + 1)
    cookies.set("_jwtService", token, { path: '/', expires: nextDay })
}

export const getAccessToken = () => {
    return cookies.get("_jwtAlbum")
}