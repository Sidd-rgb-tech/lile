package com.change360.app.ui.screens

import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.change360.app.data.model.AwarenessCategory
import com.change360.app.data.model.PosterType
import com.change360.app.data.model.ProofTier
import com.change360.app.poster.PosterData
import com.change360.app.poster.PosterRenderer
import com.change360.app.ui.theme.*
import com.change360.app.viewmodel.Change360ViewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PosterGeneratorScreen(viewModel: Change360ViewModel) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val uiState by viewModel.uiState.collectAsState()

    var selectedPosterType by remember { mutableStateOf(PosterType.CUSTOM_AWARENESS) }
    var selectedCategory by remember { mutableStateOf(AwarenessCategory.ENVIRONMENT) }
    var selectedTemplate by remember { mutableStateOf("vibrant_eco") }

    var headline by remember { mutableStateOf("Small Swaps, Big Impact") }
    var subheadline by remember { mutableStateOf("Every reusable choice keeps our streets and waterways free of plastic pollution.") }
    var callToAction by remember { mutableStateOf("Choose Reusable Today") }
    var orgName by remember { mutableStateOf(uiState.userProfile.displayName) }

    var bullet1 by remember { mutableStateOf("Carry your own reusable water bottle & cloth bag") }
    var bullet2 by remember { mutableStateOf("Refuse single-use plastic cutlery and wrappers") }
    var bullet3 by remember { mutableStateOf("Sort recyclables responsibly at school & home") }

    var isSaving by remember { mutableStateOf(false) }
    var saveMessage by remember { mutableStateOf<String?>(null) }

    // Derive actual database statistics
    val categoryRecords = uiState.impactRecords.filter { it.category == selectedCategory }
    val verifiedCount = categoryRecords.count { it.proofTier == ProofTier.VERIFIED_ACTIVITY || it.proofTier == ProofTier.MEASURED_OUTCOME }
    val selfReportedCount = categoryRecords.count { it.proofTier == ProofTier.SELF_REPORTED_ACTION }

    val templates = listOf(
        "vibrant_eco" to "Vibrant Eco-Green",
        "bold_neon" to "Bold Neon Cyber",
        "clean_minimal" to "Clean Minimalist Light",
        "infographic" to "Infographic Visual",
        "community" to "Community Drive",
        "health" to "Health & Well-being",
        "school" to "School Campaign",
        "personal_summary" to "Personal Impact Summary"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(LightBackground)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Impact Poster Generator",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Black,
                    color = TextPrimary
                )
                Text(
                    text = "8 Vibrant Visual Styles • Automatic Text Wrap • High-Res PNG",
                    style = MaterialTheme.typography.bodySmall,
                    color = DeepTeal,
                    fontWeight = FontWeight.SemiBold
                )
            }
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = ElectricCoralContainer
            ) {
                Text(
                    text = "VIBRANT",
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Black,
                    color = ElectricCoral
                )
            }
        }

        // 8 Visual Styles Carousel
        Text(
            text = "Select Graphic Style (8 Themes):",
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(templates) { (key, label) ->
                val isSelected = selectedTemplate == key
                FilterChip(
                    selected = isSelected,
                    onClick = { selectedTemplate = key },
                    label = { Text(label, fontSize = 11.sp, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = DeepTealContainer,
                        selectedLabelColor = DeepTeal
                    )
                )
            }
        }

        // Live Graphic Preview Card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(2.dp, Brush.linearGradient(listOf(DeepTeal, NeonMint)), RoundedCornerShape(24.dp)),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(
                containerColor = when (selectedTemplate) {
                    "bold_neon" -> Color(0xFF0F172A)
                    "vibrant_eco" -> Color(0xFFE8FDF3)
                    "infographic" -> Color(0xFFEBF4FF)
                    "community" -> Color(0xFFFFF7ED)
                    "health" -> Color(0xFFECFEFF)
                    "school" -> Color(0xFFF5F3FF)
                    "personal_summary" -> Color(0xFFF0FDF4)
                    else -> Color(0xFFF8FAFC)
                }
            )
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(22.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                val isDark = selectedTemplate == "bold_neon"

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = if (isDark) Color(0xFFFEF3C7) else DeepTealContainer
                    ) {
                        Text(
                            text = selectedCategory.displayName.uppercase(),
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black,
                            color = if (isDark) Color(0xFF92400E) else DeepTeal
                        )
                    }

                    Text(
                        text = selectedPosterType.displayName.uppercase(),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isDark) Color.White.copy(alpha = 0.8f) else TextSecondary
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                Text(
                    text = headline,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Black,
                    color = if (isDark) Color.White else TextPrimary,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = subheadline,
                    style = MaterialTheme.typography.bodySmall,
                    color = if (isDark) Color(0xFF94A3B8) else TextSecondary,
                    textAlign = TextAlign.Center,
                    lineHeight = 16.sp
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Action points preview
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(if (isDark) Color(0xFF1E293B) else Color.White)
                        .padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text("• $bullet1", color = if (isDark) Color.White else TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Medium)
                    Text("• $bullet2", color = if (isDark) Color.White else TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Medium)
                    Text("• $bullet3", color = if (isDark) Color.White else TextPrimary, fontSize = 11.sp, fontWeight = FontWeight.Medium)
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Call to action preview button
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = ElectricCoral
                ) {
                    Text(
                        text = callToAction.uppercase(),
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 10.dp),
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "CHANGE360 • $orgName",
                    fontSize = 10.sp,
                    color = TextMuted
                )
            }
        }

        // Customization Inputs
        OutlinedTextField(
            value = headline,
            onValueChange = { headline = it },
            label = { Text("Headline Title") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp)
        )

        OutlinedTextField(
            value = subheadline,
            onValueChange = { subheadline = it },
            label = { Text("Educational Subtitle / Context") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp)
        )

        OutlinedTextField(
            value = callToAction,
            onValueChange = { callToAction = it },
            label = { Text("Call to Action") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp)
        )

        OutlinedTextField(
            value = orgName,
            onValueChange = { orgName = it },
            label = { Text("Author / School / Group Name") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp)
        )

        // Save & Share Buttons (High-Energy Bouncy Buttons)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Button(
                onClick = {
                    isSaving = true
                    coroutineScope.launch {
                        val posterData = PosterData(
                            title = headline,
                            subtitle = subheadline,
                            callToAction = callToAction,
                            bullets = listOf(bullet1, bullet2, bullet3),
                            category = selectedCategory,
                            posterType = selectedPosterType,
                            templateName = selectedTemplate,
                            authorOrOrgName = orgName,
                            recordedActionsCount = categoryRecords.size,
                            verifiedCount = verifiedCount,
                            selfReportedCount = selfReportedCount
                        )

                        val bitmap = PosterRenderer.renderPosterBitmap(posterData)
                        val savedUri = PosterRenderer.saveBitmapToMediaStore(
                            context,
                            bitmap,
                            "change360_${System.currentTimeMillis()}"
                        )
                        isSaving = false

                        if (savedUri != null) {
                            saveMessage = "Poster exported to Gallery & MediaStore (1080x1350 PNG)!"
                            Toast.makeText(context, "Poster saved to MediaStore!", Toast.LENGTH_LONG).show()
                        } else {
                            saveMessage = "Saved to device storage."
                        }
                    }
                },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = DeepTeal),
                enabled = !isSaving
            ) {
                Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(if (isSaving) "Rendering..." else "Save PNG", fontWeight = FontWeight.Bold)
            }

            Button(
                onClick = {
                    coroutineScope.launch {
                        val posterData = PosterData(
                            title = headline,
                            subtitle = subheadline,
                            callToAction = callToAction,
                            bullets = listOf(bullet1, bullet2, bullet3),
                            category = selectedCategory,
                            posterType = selectedPosterType,
                            templateName = selectedTemplate,
                            authorOrOrgName = orgName,
                            recordedActionsCount = categoryRecords.size,
                            verifiedCount = verifiedCount,
                            selfReportedCount = selfReportedCount
                        )
                        val bitmap = PosterRenderer.renderPosterBitmap(posterData)
                        val contentUri = PosterRenderer.createShareableImageUri(
                            context,
                            bitmap,
                            "share_poster_${System.currentTimeMillis()}"
                        )

                        val shareIntent = Intent(Intent.ACTION_SEND).apply {
                            if (contentUri != null) {
                                type = "image/png"
                                putExtra(Intent.EXTRA_STREAM, contentUri)
                                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                            } else {
                                type = "text/plain"
                            }
                            putExtra(Intent.EXTRA_SUBJECT, headline)
                            putExtra(Intent.EXTRA_TEXT, "$headline\n$subheadline\n\nTake action: $callToAction\nCreated with CHANGE360")
                        }
                        context.startActivity(Intent.createChooser(shareIntent, "Share Impact Poster"))
                    }
                },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = ElectricCoral)
            ) {
                Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Native Share", fontWeight = FontWeight.Bold)
            }
        }

        saveMessage?.let {
            Text(
                text = it,
                color = DeepTeal,
                style = MaterialTheme.typography.bodySmall,
                textAlign = TextAlign.Center,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}
