import React from 'react'

export const BackWarningViewWrapper: React.FC<{
  isModalActive?: boolean
  internetConnection?: boolean
  titleText?: string
  closeModal?: () => void
  backNavigation?: () => void
  navigationHooks?: any[]
  children?: React.ReactNode
}> = ({ children }) => <div data-testid="back-warning-view-wrapper">{children}</div>
