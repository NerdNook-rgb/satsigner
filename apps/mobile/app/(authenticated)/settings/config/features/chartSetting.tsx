import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import SSButton from '@/components/SSButton'
import SSCheckbox from '@/components/SSCheckbox'
import SSText from '@/components/SSText'
import SSMainLayout from '@/layouts/SSMainLayout'
import SSVStack from '@/layouts/SSVStack'
import { i18n } from '@/locales'
import { useChartSettingStore } from '@/store/chartSetting'

export default function ChartSettings() {
  const router = useRouter()
  const [
    showLabel,
    setShowLabel,
    showAmount,
    setShowAmount,
    showTransactionInfo,
    setShowTransactionInfo,
    showOutputField,
    setShowOutputField,
    lockZoomToXAxis,
    setLockZoomToXAxis
  ] = useChartSettingStore(
    useShallow((state) => [
      state.showLabel,
      state.setShowLabel,
      state.showAmount,
      state.setShowAmount,
      state.showTransactionInfo,
      state.setShowTransactionInfo,
      state.showOutputField,
      state.setShowOutputField,
      state.lockZoomToXAxis,
      state.setLockZoomToXAxis
    ])
  )

  const [selectedShowLabel, setSelectedShowLabel] = useState(showLabel)
  const [selectedShowAmount, setSelectedShowAmount] = useState(showAmount)
  const [selectedShowTransactionInfo, setSelectedShowTransactionInfo] =
    useState(showTransactionInfo)
  const [selectedShowOutputField, setSelectedShowOutputField] =
    useState(showOutputField)
  const [selectedLockZoomToXAxis, setSelectedLockZoomToXAxis] =
    useState(lockZoomToXAxis)

  function handleOnSave() {
    setShowLabel(selectedShowLabel)
    setShowAmount(selectedShowAmount)
    setShowTransactionInfo(selectedShowTransactionInfo)
    setShowOutputField(selectedShowOutputField)
    setLockZoomToXAxis(selectedLockZoomToXAxis)
    router.back()
  }

  return (
    <SSMainLayout>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <SSText uppercase>
              {i18n.t('settings.features.featurePage.chartSettingsPage.title')}
            </SSText>
          ),
          headerBackVisible: true,
          headerLeft: () => <></>,
          headerRight: undefined
        }}
      />
      <SSVStack justifyBetween>
        <ScrollView>
          <SSVStack gap="lg">
            <SSVStack>
              <SSText>
                {i18n.t(
                  'settings.features.featurePage.chartSettingsPage.layersTitle'
                )}
              </SSText>
              <SSCheckbox
                label={i18n.t(
                  'settings.features.featurePage.chartSettingsPage.layersShowLabels'
                )}
                selected={selectedShowLabel}
                onPress={() => setSelectedShowLabel((prev) => !prev)}
              />
              <SSCheckbox
                label={i18n.t(
                  'settings.features.featurePage.chartSettingsPage.layersShowAmounts'
                )}
                selected={selectedShowAmount}
                onPress={() => setSelectedShowAmount((prev) => !prev)}
              />
              <SSCheckbox
                label={i18n.t(
                  'settings.features.featurePage.chartSettingsPage.layersShowTransactionInfo'
                )}
                selected={selectedShowTransactionInfo}
                onPress={() => setSelectedShowTransactionInfo((prev) => !prev)}
              />
              <SSCheckbox
                label={i18n.t(
                  'settings.features.featurePage.chartSettingsPage.layersShowOutputFields'
                )}
                selected={selectedShowOutputField}
                onPress={() => setSelectedShowOutputField((prev) => !prev)}
              />
            </SSVStack>
            <SSVStack>
              <SSText>
                {i18n.t(
                  'settings.features.featurePage.chartSettingsPage.navigationTitle'
                )}
              </SSText>
              <SSCheckbox
                label={i18n.t(
                  'settings.features.featurePage.chartSettingsPage.navigationLockZoomXAxis'
                )}
                selected={selectedLockZoomToXAxis}
                onPress={() => setSelectedLockZoomToXAxis((prev) => !prev)}
              />
            </SSVStack>
          </SSVStack>
        </ScrollView>
        <SSVStack>
          <SSButton
            label={i18n.t('common.save')}
            variant="secondary"
            onPress={() => handleOnSave()}
          />
          <SSButton
            label={i18n.t('common.cancel')}
            variant="ghost"
            onPress={() => router.back()}
          />
        </SSVStack>
      </SSVStack>
    </SSMainLayout>
  )
}
