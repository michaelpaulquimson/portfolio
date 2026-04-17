import React from 'react'
import './GlowOrb.css'

interface GlowOrbProps {
  size?: number
}

const GlowOrb: React.FC<GlowOrbProps> = ({ size = 320 }) => (
  <div
    className="glow-orb"
    aria-hidden="true"
    style={{ '--orb-size': `${size}px` } as React.CSSProperties}
  >
    <div className="glow-orb__core" />
    <div className="glow-orb__ring glow-orb__ring--inner" />
    <div className="glow-orb__ring glow-orb__ring--outer" />
  </div>
)

export default GlowOrb
