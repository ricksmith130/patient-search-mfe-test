import React from 'react'

const ConnectionWarningCloseButton: React.FC<{
  closeModal?: () => void
}> = ({ closeModal }) => (
  <button onClick={closeModal}>Close</button>
)

export default ConnectionWarningCloseButton
