import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

export const useAppDispatch = () => useDispatch()
export const useAppSelector: TypedUseSelectorHook<any> = useSelector
