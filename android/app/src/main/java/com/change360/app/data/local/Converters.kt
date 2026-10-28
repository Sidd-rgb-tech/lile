package com.change360.app.data.local

import androidx.room.TypeConverter
import com.change360.app.data.model.AwarenessCategory
import com.change360.app.data.model.ChallengeDifficulty
import com.change360.app.data.model.ChallengeStatus
import com.change360.app.data.model.PosterType
import com.change360.app.data.model.ProofTier

class Converters {
    @TypeConverter
    fun fromCategory(category: AwarenessCategory): String = category.name

    @TypeConverter
    fun toCategory(value: String): AwarenessCategory = AwarenessCategory.fromString(value)

    @TypeConverter
    fun fromDifficulty(diff: ChallengeDifficulty): String = diff.name

    @TypeConverter
    fun toDifficulty(value: String): ChallengeDifficulty = ChallengeDifficulty.valueOf(value)

    @TypeConverter
    fun fromStatus(status: ChallengeStatus): String = status.name

    @TypeConverter
    fun toStatus(value: String): ChallengeStatus = ChallengeStatus.valueOf(value)

    @TypeConverter
    fun fromProofTier(tier: ProofTier): String = tier.name

    @TypeConverter
    fun toProofTier(value: String): ProofTier = ProofTier.fromString(value)

    @TypeConverter
    fun fromPosterType(type: PosterType): String = type.name

    @TypeConverter
    fun toPosterType(value: String): PosterType = PosterType.valueOf(value)

    @TypeConverter
    fun fromStringList(list: List<String>): String = list.joinToString(";;")

    @TypeConverter
    fun toStringList(value: String): List<String> = if (value.isBlank()) emptyList() else value.split(";;")
}
