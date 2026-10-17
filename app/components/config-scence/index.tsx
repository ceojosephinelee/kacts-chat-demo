import type { FC } from 'react'
import React from 'react'
import type { IWelcomeProps } from '../welcome'
import Welcome from '../welcome'

const ConfigSence: FC<IWelcomeProps> = (props) => {
  if (props.hasSetInputs) return null

  return (
    <div className='flex-1 antialiased overflow-hidden' style={{ fontFamily: 'var(--body)' }}>
      <Welcome {...props} />
    </div>
  )
}
export default React.memo(ConfigSence)