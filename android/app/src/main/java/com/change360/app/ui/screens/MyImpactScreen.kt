package com.change360.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.change360.app.data.model.ImpactRecord
import com.change360.app.data.model.ProofTier
import com.change360.app.viewmodel.Change360ViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MyImpactScreen(viewModel: Change360ViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    var selectedFilter by remember { mutableStateOf("all") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.surface)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 90.dp)
    ) {
        item {
            Text(
                text = "My Impact Dashboard",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Verified transparency under CHANGE360 Proof of Impact Framework",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Summary Stats Grid
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                ImpactMetricCard(
                    modifier = Modifier.weight(1f),
                    label = "Total Points",
                    value = "${uiState.userProfile.totalPoints}",
                    icon = Icons.Default.Stars,
                    color = Color(0xFF00897B)
                )
                ImpactMetricCard(
                    modifier = Modifier.weight(1f),
                    label = "Actions Logged",
                    value = "${uiState.impactRecords.size}",
                    icon = Icons.Default.CheckCircle,
                    color = Color(0xFF0288D1)
                )
                ImpactMetricCard(
                    modifier = Modifier.weight(1f),
                    label = "Badges",
                    value = "${uiState.badges.count { it.isUnlocked }}",
                    icon = Icons.Default.EmojiEvents,
                    color = Color(0xFFF59E0B)
                )
            }
        }

        // Proof of Impact Breakdown Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Proof of Impact Framework",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    ProofTierRow(
                        tierName = "Learning Completed",
                        count = uiState.impactRecords.count { it.proofTier == ProofTier.LEARNING_COMPLETED },
                        color = Color(0xFF3B82F6),
                        description = "Educational modules and awareness quizzes"
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    ProofTierRow(
                        tierName = "Self-Reported Action",
                        count = uiState.impactRecords.count { it.proofTier == ProofTier.SELF_REPORTED_ACTION },
                        color = Color(0xFF10B981),
                        description = "Honest user-reported daily positive actions"
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    ProofTierRow(
                        tierName = "Verified Activity",
                        count = uiState.impactRecords.count { it.proofTier == ProofTier.VERIFIED_ACTIVITY },
                        color = Color(0xFF8B5CF6),
                        description = "Supervisor or coordinator validated submissions"
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    ProofTierRow(
                        tierName = "Measured Outcome",
                        count = uiState.impactRecords.count { it.proofTier == ProofTier.MEASURED_OUTCOME },
                        color = Color(0xFFF59E0B),
                        description = "Quantified, documented impact metrics"
                    )
                }
            }
        }

        // Activity Log History
        item {
            Text(
                text = "Recent Activity Log",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
        }

        if (uiState.impactRecords.isEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Box(modifier = Modifier.padding(24.dp), contentAlignment = Alignment.Center) {
                        Text(
                            text = "No recorded activities yet. Complete a challenge to log your first impact!",
                            style = MaterialTheme.typography.bodyMedium,
                            color = Color.Gray
                        )
                    }
                }
            }
        } else {
            items(uiState.impactRecords) { record ->
                ImpactRecordItem(record = record)
            }
        }
    }
}

@Composable
fun ImpactMetricCard(
    modifier: Modifier = Modifier,
    label: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.1f))
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(imageVector = icon, contentDescription = null, tint = color, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = value, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = color)
            Text(text = label, style = MaterialTheme.typography.labelSmall, color = Color.Gray)
        }
    }
}

@Composable
fun ProofTierRow(
    tierName: String,
    count: Int,
    color: Color,
    description: String
) {
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(modifier = Modifier.size(10.dp), shape = RoundedCornerShape(5.dp), color = color) {}
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = tierName, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
            }
            Text(text = "$count recorded", style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.Bold)
        }
        Text(text = description, style = MaterialTheme.typography.bodySmall, color = Color.Gray, fontSize = 11.sp)
    }
}

@Composable
fun ImpactRecordItem(record: ImpactRecord) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(text = record.title, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.SemiBold)
                Text(
                    text = "${record.category.displayName} • ${record.proofTier.title}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.primary,
                    fontSize = 11.sp
                )
                if (record.notes.isNotBlank()) {
                    Text(text = "\"${record.notes}\"", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                }
            }
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
            ) {
                Text(
                    text = "+${record.pointsEarned} pts",
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary,
                    fontSize = 12.sp
                )
            }
        }
    }
}
