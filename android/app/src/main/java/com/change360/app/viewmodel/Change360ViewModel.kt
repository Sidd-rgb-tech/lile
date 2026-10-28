package com.change360.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.change360.app.data.model.*
import com.change360.app.data.repository.Change360Repository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class Change360UiState(
    val challenges: List<Challenge> = emptyList(),
    val impactRecords: List<ImpactRecord> = emptyList(),
    val badges: List<Badge> = emptyList(),
    val userProfile: UserProfile = UserProfile(),
    val selectedCategoryFilter: AwarenessCategory? = null,
    val selectedDifficultyFilter: ChallengeDifficulty? = null,
    val searchQuery: String = "",
    val isLoading: Boolean = false,
    val activeTab: String = "home"
)

class Change360ViewModel(private val repository: Change360Repository) : ViewModel() {

    private val _categoryFilter = MutableStateFlow<AwarenessCategory?>(null)
    private val _difficultyFilter = MutableStateFlow<ChallengeDifficulty?>(null)
    private val _searchQuery = MutableStateFlow("")

    val uiState: StateFlow<Change360UiState> = combine(
        repository.challenges,
        repository.impactRecords,
        repository.badges,
        repository.userProfile,
        _categoryFilter,
        _difficultyFilter,
        _searchQuery
    ) { challenges, records, badges, profile, catFilter, diffFilter, query ->
        val filteredChallenges = challenges.filter { ch ->
            (catFilter == null || ch.category == catFilter) &&
            (diffFilter == null || ch.difficulty == diffFilter) &&
            (query.isBlank() || ch.title.contains(query, ignoreCase = true) || ch.shortDescription.contains(query, ignoreCase = true))
        }

        Change360UiState(
            challenges = filteredChallenges,
            impactRecords = records,
            badges = badges,
            userProfile = profile ?: UserProfile(),
            selectedCategoryFilter = catFilter,
            selectedDifficultyFilter = diffFilter,
            searchQuery = query,
            isLoading = false
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = Change360UiState(isLoading = true)
    )

    init {
        viewModelScope.launch {
            repository.seedInitialDataIfEmpty()
        }
    }

    fun setCategoryFilter(category: AwarenessCategory?) {
        _categoryFilter.value = category
    }

    fun setDifficultyFilter(difficulty: ChallengeDifficulty?) {
        _difficultyFilter.value = difficulty
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun startChallenge(challengeId: String) {
        viewModelScope.launch {
            repository.startChallenge(challengeId)
        }
    }

    fun completeChallenge(challengeId: String, reflection: String, tier: ProofTier = ProofTier.SELF_REPORTED_ACTION) {
        viewModelScope.launch {
            repository.completeChallenge(challengeId, reflection, tier)
        }
    }

    fun updateUserProfile(profile: UserProfile) {
        viewModelScope.launch {
            repository.updateUserProfile(profile)
        }
    }
}

class Change360ViewModelFactory(private val repository: Change360Repository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(Change360ViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return Change360ViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
