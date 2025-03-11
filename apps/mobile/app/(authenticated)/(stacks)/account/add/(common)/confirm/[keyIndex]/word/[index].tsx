import { type Network } from 'bdk-rn/lib/lib/enums'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { getExtendedPublicKeyFromAccountKey, getWallet } from '@/api/bdk'
import {
  SSIconCheckCircle,
  SSIconCircleX,
  SSIconHideWarning
} from '@/components/icons'
import SSButton from '@/components/SSButton'
import SSCheckbox from '@/components/SSCheckbox'
import SSGradientModal from '@/components/SSGradientModal'
import SSText from '@/components/SSText'
import SSWarningModal from '@/components/SSWarningModal'
import SSHStack from '@/layouts/SSHStack'
import SSMainLayout from '@/layouts/SSMainLayout'
import SSVStack from '@/layouts/SSVStack'
import { t } from '@/locales'
import { useAccountBuilderStore } from '@/store/accountBuilder'
import { useBlockchainStore } from '@/store/blockchain'
import { type ConfirmWordSearchParams } from '@/types/navigation/searchParams'
import { getConfirmWordCandidates } from '@/utils/seed'
import useAccountBuilderFinish from '@/hooks/useAccountBuilderFinish'

export default function Confirm() {
  const router = useRouter()
  const { keyIndex, index } = useLocalSearchParams<ConfirmWordSearchParams>()
  const [
    name,
    mnemonicWordCount,
    mnemonic,
    policyType,
    clearAccount,
    getAccountData,
    setKey,
    updateKeySecret,
    clearKeyState
  ] = useAccountBuilderStore(
    useShallow((state) => [
      state.name,
      state.mnemonicWordCount,
      state.mnemonic.split(' '),
      state.policyType,
      state.clearAccount,
      state.getAccountData,
      state.setKey,
      state.updateKeySecret,
      state.clearKeyState
    ])
  )
  const network = useBlockchainStore((state) => state.network)
  const { accountBuilderFinish } = useAccountBuilderFinish()

  const candidateWords = useMemo(() => {
    return getConfirmWordCandidates(mnemonic[Number(index)], mnemonic.join(' '))
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  const [selectedCheckbox, setSelectedCheckbox] = useState<1 | 2 | 3>()

  const [loadingAccount, setLoadingAccount] = useState(false)

  const [incorrectWordModalVisible, setIncorrectWordModalVisible] =
    useState(false)
  const [warningModalVisible, setWarningModalVisible] = useState(false)

  async function handleNavigateNextWord() {
    if (!selectedCheckbox) return

    if (candidateWords[selectedCheckbox - 1] !== mnemonic[Number(index)])
      return setIncorrectWordModalVisible(true)

    if (Number(index) + 1 < mnemonicWordCount)
      router.push(`/account/add/confirm/${keyIndex}/word/${Number(index) + 1}`)
    else return handleFinishWordsConfirmation()
  }

  async function handleFinishWordsConfirmation() {
    setLoadingAccount(true)
    const currentKey = setKey(Number(keyIndex))

    if (policyType === 'singlesig') {
      const account = getAccountData()

      await accountBuilderFinish(account)

      setLoadingAccount(false)
      setWarningModalVisible(true)
    } else if (policyType === 'multisig') {
      const extendedPublicKey = await getExtendedPublicKeyFromAccountKey(
        currentKey,
        network as Network
      )
      updateKeySecret(Number(keyIndex), {
        ...(currentKey.secret as object),
        extendedPublicKey
      })

      setLoadingAccount(false)
      router.dismiss(Number(index) + 3)
    }
    clearKeyState()
  }

  function handleCloseWordsWarning() {
    setWarningModalVisible(false)
    clearAccount()
    router.navigate('/')
  }

  function handleOnPressCancel() {
    if (policyType === 'multisig') {
      router.dismiss(Number(index) + 1)
    } else if (policyType === 'singlesig') {
      router.replace('/')
    }
  }

  return (
    <SSMainLayout>
      <Stack.Screen
        options={{
          headerTitle: () => <SSText uppercase>{name}</SSText>
        }}
      />
      <SSVStack justifyBetween>
        <SSVStack gap="lg">
          <SSText color="white" uppercase style={{ alignSelf: 'center' }}>
            {`${t('common.confirm')} ${t('bitcoin.word')} ${Number(index) + 1}`}
          </SSText>
          <SSVStack gap="lg">
            <SSCheckbox
              label={candidateWords[0]}
              selected={selectedCheckbox === 1}
              onPress={() => setSelectedCheckbox(1)}
            />
            <SSCheckbox
              label={candidateWords[1]}
              selected={selectedCheckbox === 2}
              onPress={() => setSelectedCheckbox(2)}
            />
            <SSCheckbox
              label={candidateWords[2]}
              selected={selectedCheckbox === 3}
              onPress={() => setSelectedCheckbox(3)}
            />
          </SSVStack>
        </SSVStack>
        <SSVStack>
          <SSButton
            label={t('common.next')}
            variant="secondary"
            loading={loadingAccount}
            disabled={!selectedCheckbox}
            onPress={handleNavigateNextWord}
          />
          <SSButton
            label={t('common.cancel')}
            variant="ghost"
            onPress={handleOnPressCancel}
          />
        </SSVStack>
      </SSVStack>
      <SSGradientModal
        visible={incorrectWordModalVisible}
        closeText={t('account.confirmSeed.tryAgain')}
        onClose={() => setIncorrectWordModalVisible(false)}
      >
        <SSVStack itemsCenter style={{ marginVertical: 32 }}>
          <SSIconCircleX height={88} width={88} />
          <SSText size="3xl" center style={{ maxWidth: 200 }}>
            {t('account.confirmSeed.warning')}
          </SSText>
        </SSVStack>
      </SSGradientModal>
      <SSWarningModal
        visible={warningModalVisible}
        onClose={handleCloseWordsWarning}
      >
        <SSVStack itemsCenter>
          <SSHStack>
            <SSIconCheckCircle height={30} width={30} />
            <SSText size="3xl">
              {mnemonicWordCount} {t('common.of').toLowerCase()}{' '}
              {mnemonicWordCount}
            </SSText>
          </SSHStack>
          <SSText uppercase center>
            {t('bitcoin.notYourKeys')}
            {'\n'}
            {t('bitcoin.notYourCoins')}
          </SSText>
          <SSText size="6xl">{t('common.warning')}</SSText>
          <SSIconHideWarning height={132} width={210} />
          <SSText size="2xl" center style={{ maxWidth: 260 }}>
            {t('account.generate.warning')}
          </SSText>
          <SSText size="xl" color="muted" center>
            {t('account.generate.disclaimer.1')}
          </SSText>
          <SSText size="xl" color="muted" center>
            {t('account.generate.disclaimer.2')}
          </SSText>
          <SSText size="xl" color="muted" center>
            {t('account.generate.disclaimer.3')}
          </SSText>
        </SSVStack>
      </SSWarningModal>
    </SSMainLayout>
  )
}
