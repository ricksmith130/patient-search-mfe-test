import React from 'react'

const GenericModal: React.FC<{
  isVisible?: boolean
  closeModalFunction?: () => void
  shouldCloseOnOverlayClick?: boolean
  headerContent?: React.ReactNode
  bodyContent?: React.ReactNode
  buttons?: React.ReactNode[]
}> = ({ isVisible, headerContent, bodyContent, buttons }) => {
  if (!isVisible) return null
  return (
    <div data-testid="generic-modal">
      {headerContent && <div>{headerContent}</div>}
      {bodyContent && <div>{bodyContent}</div>}
      {buttons && <div>{buttons}</div>}
    </div>
  )
}

export default GenericModal
