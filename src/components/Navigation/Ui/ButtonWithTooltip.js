// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const ButtonWithTooltip = ({ children, tip }) => {
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{tip}</Tooltip>}>
      {children}
    </OverlayTrigger>
  )
}

export default ButtonWithTooltip
