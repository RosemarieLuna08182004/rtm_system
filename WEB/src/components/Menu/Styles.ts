import styled from 'styled-components'
import UIcon from '@mdi/react'

// Inherit the colour from the parent button so the icon follows the text (white, or hover/active states).
export const Icon = styled(UIcon)`
    color: currentColor;
    flex-shrink: 0;
`