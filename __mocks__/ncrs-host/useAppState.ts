import { useSelector } from 'react-redux'

export const useAppState = (selector: (state: any) => any) => useSelector(selector)
