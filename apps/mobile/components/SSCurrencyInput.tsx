import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useMemo,
  useState
} from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

import { Colors, Sizes } from '@/styles'

type SSTextInputProps = {
  variant?: 'default' | 'outline'
  size?: 'default' | 'small' | 'large'
  align?: 'center' | 'left'
  actionRight?: React.ReactNode
  onChangeValue: any
} & React.ComponentPropsWithoutRef<typeof TextInput>

const formatNumberWithCommas = (numStr: string) => {
  let rawText = ''
  if (numStr.indexOf('e') !== -1) {
    const [baseStr, exponentStr] = numStr.split('e')
    const exponent = parseInt(exponentStr, 10)

    let [integerPart, fractionalPart = ''] = baseStr.split('.')

    if (exponent > 0) {
      fractionalPart = fractionalPart.padEnd(exponent, '0')
      const combined = integerPart + fractionalPart
      rawText = combined + '0'.repeat(exponent - fractionalPart.length)
    } else {
      const zeros = Math.abs(exponent) - 1
      rawText = '0.' + '0'.repeat(zeros) + integerPart + fractionalPart
    }
  } else {
    rawText = numStr
  }

  rawText = rawText.replace(/[^\d.]/g, '')

  if (rawText.includes('.')) {
    let [integerPart, decimalPart] = rawText.split('.')
    integerPart = integerPart.replace(/^0+/, '') || '0'
    decimalPart = decimalPart.slice(0, 8)
    const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return formattedInt + '.' + decimalPart
  }

  const cleanNum = rawText.replace(/^0+/, '') || '0'
  return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function SSCurrencyInput(
  {
    variant = 'default',
    size = 'default',
    align = 'left',
    actionRight,
    value,
    onChangeValue,
    style,
    ...props
  }: SSTextInputProps,
  ref: ForwardedRef<TextInput>
) {
  const textInputStyle = useMemo(() => {
    const variantStyle =
      variant === 'default' ? styles.variantDefault : styles.variantOutline
    const sizeStyle =
      size === 'default'
        ? styles.sizeDefault
        : size === 'small'
          ? styles.sizeSmall
          : styles.sizeLarge
    const alignStyle =
      align === 'center' ? styles.alignCenter : styles.alignLeft
    const newStyle = StyleSheet.compose(
      {
        ...styles.textInputBase,
        ...variantStyle,
        ...sizeStyle,
        ...alignStyle
      },
      style
    )
    return newStyle
  }, [variant, size, align, style])

  const [localValue, setLocalValue] = useState(value || '')

  useEffect(() => {
    if (value !== localValue && value !== undefined) {
      const rawValue = value?.replace(/,/g, '')
      setLocalValue(formatNumberWithCommas(rawValue) || '')
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleTextChange(text: string) {
    if (text === '') {
      setLocalValue('0')
      return
    }

    const rawValue = text.replace(/,/g, '')
    if (/^(\d*\.?\d*)$/.test(rawValue) || rawValue === '') {
      const formattedValue = formatNumberWithCommas(rawValue)

      setLocalValue(formattedValue)
      if (onChangeValue) onChangeValue(parseFloat(rawValue))
    }
  }

  return (
    <View style={styles.containerBase}>
      <TextInput
        ref={ref}
        value={localValue}
        onChangeText={handleTextChange}
        // onSubmitEditing={handleSubmitText}
        keyboardType="numeric"
        placeholderTextColor={Colors.gray[400]}
        style={textInputStyle}
        {...props}
      />
      <View style={styles.actionRightBase}>{actionRight}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerBase: {
    position: 'relative',
    width: '100%'
  },
  textInputBase: {
    borderRadius: Sizes.textInput.borderRadius,
    width: '100%',
    textAlign: 'center',
    color: Colors.white
  },
  variantDefault: {
    backgroundColor: Colors.gray[850]
  },
  variantOutline: {
    borderWidth: 1,
    borderColor: Colors.gray[400]
  },
  sizeDefault: {
    fontSize: Sizes.textInput.fontSize.default,
    height: Sizes.textInput.height.default
  },
  sizeSmall: {
    fontSize: Sizes.textInput.fontSize.small,
    height: Sizes.textInput.height.small
  },
  sizeLarge: {
    fontSize: Sizes.textInput.fontSize.large,
    height: Sizes.textInput.height.large
  },
  alignCenter: {
    textAlign: 'center',
    paddingHorizontal: 12
  },
  alignLeft: {
    textAlign: 'left',
    paddingHorizontal: 12
  },
  actionRightBase: {
    position: 'absolute',
    top: '50%',
    right: 12,
    transform: [{ translateY: -12 }]
  },
  borderInvalid: {
    borderWidth: 2,
    borderColor: Colors.error
  }
})

export default forwardRef(SSCurrencyInput)
