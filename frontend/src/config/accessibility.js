export const ACCESSIBILITY_NEEDS = [
  { id: 'mobility', label: 'Mobility', apiLabel: 'Mobility' },
  { id: 'visual', label: 'Visual', apiLabel: 'Visual' },
  { id: 'hearing', label: 'Hearing', apiLabel: 'Hearing' },
  { id: 'cognitive', label: 'Cognitive', apiLabel: 'Cognitive' },
  { id: 'age-related', label: 'Age-related', apiLabel: 'Age-related' }
]

export const PREFERENCES = [
  { id: 'wheelchair', label: 'Wheelchair accessible', apiLabel: 'Wheelchair Accessible' },
  { id: 'toilet', label: 'Accessible toilet', apiLabel: 'Accessible Toilet' },
  { id: 'lowStairs', label: 'Low stairs', apiLabel: 'Low Stairs' },
  { id: 'lessCrowded', label: 'Less crowded', apiLabel: 'Less Crowded' },
  { id: 'lift', label: 'Lift available', apiLabel: 'Elevator' },
  { id: 'assistance', label: 'Assistance available', apiLabel: 'Assistance' }
]

export const SORT_OPTIONS = [
  { id: 'accessibility', label: 'Best match' },
  { id: 'nearest', label: 'Nearest' },
  { id: 'crowd', label: 'Least crowded' },
  { id: 'weather', label: 'Best weather' },
  { id: 'assistance', label: 'Assistance' }
]

export const BARRIER_TYPES = [
  'Blocked Ramp',
  'Broken Lift',
  'Closed Accessible Toilet',
  'Blocked Path',
  'Stairs / Construction',
  'Crowded Area',
  'Other'
]

export function accessibilityNeedLabel(id) {
  return ACCESSIBILITY_NEEDS.find((need) => need.id === id)?.apiLabel || id || ''
}

export function selectedPreferenceLabels(preferences = {}) {
  return PREFERENCES.filter((preference) => preferences[preference.id]).map((preference) => preference.apiLabel)
}