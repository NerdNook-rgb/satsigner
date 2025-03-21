import { StyleSheet } from 'react-native'

import SSHStack from '@/layouts/SSHStack'
import { Colors } from '@/styles'

import SSClipboardCopy from './SSClipboardCopy'
import SSText, { type SSTextProps } from './SSText'

type SSAddressDisplayProps = {
  address: string
  variant?: 'box' | 'darkbox' | 'simple'
} & SSTextProps

function SSAddressDisplay({
  address,
  variant = 'box',
  ...props
}: SSAddressDisplayProps) {
  return (
    <SSClipboardCopy text={address}>
      <SSHStack style={styles[variant]} gap="sm">
        {(address.match(/(.{1,4})/g) || []).map((bytes, index) => (
          <SSText type="mono" size="md" {...props} key={index}>
            {bytes}
          </SSText>
        ))}
      </SSHStack>
    </SSClipboardCopy>
  )
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: Colors.gray[800],
    borderRadius: 5,
    flexWrap: 'wrap',
    padding: 12,
    width: '100%'
  },
  darkbox: {
    borderColor: Colors.gray[100],
    borderWidth: 1,
    borderRadius: 2,
    flexWrap: 'wrap',
    padding: 10,
    width: '100%'
  },
  simple: {
    flexWrap: 'wrap',
    padding: 0,
    width: '100%'
  }
})

export default SSAddressDisplay
