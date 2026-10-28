package com.change360.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val VibrantLightColorScheme = lightColorScheme(
    primary = DeepTeal,
    onPrimary = LightSurface,
    primaryContainer = DeepTealContainer,
    onPrimaryContainer = DeepTeal,
    secondary = ElectricCoral,
    onSecondary = LightSurface,
    secondaryContainer = ElectricCoralContainer,
    onSecondaryContainer = ElectricCoral,
    tertiary = CyanBlue,
    onTertiary = LightSurface,
    tertiaryContainer = CyanBlueContainer,
    onTertiaryContainer = CyanBlueDark,
    background = LightBackground,
    surface = LightSurface,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    surfaceVariant = LightSurfaceVariant,
    onSurfaceVariant = TextSecondary,
    outline = LightSurfaceBorder
)

@Composable
fun Change360Theme(
    darkTheme: Boolean = false, // Force crisp vibrant light mode as specified in Build 3
    content: @Composable () -> Unit
) {
    val colorScheme = VibrantLightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = LightSurface.toArgb()
                WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = true
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
