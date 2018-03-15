import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import Test from './App'

render(
    <Test />,
    document.getElementById('app')
)