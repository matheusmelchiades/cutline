import { PodiumTop3 } from '@/components/ranking/PodiumTop3'
import { RankingRow } from '@/components/ranking/RankingRow'
import type { MockRankedSurfer } from '@/types/mock'

interface RankingListProps {
  rankings: MockRankedSurfer[]
  onSurferClick: (id: string) => void
}

const CUTLINE_RANK = 24

export function RankingList({ rankings, onSurferClick }: RankingListProps) {
  const top3 = rankings.filter((r) => r.rank <= 3)
  const rest = rankings.filter((r) => r.rank > 3)

  return (
    <div>
      {/* Podium */}
      <PodiumTop3 top3={top3} />

      {/* Separator */}
      <div className="my-4 h-px bg-surface-input" />

      {/* Remaining surfers */}
      <div className="rounded-lg bg-surface-card">
        {rest.map((ranked, i) => {
          const showCutline =
            ranked.rank > CUTLINE_RANK &&
            (i === 0 || rest[i - 1].rank <= CUTLINE_RANK)

          return (
            <div key={ranked.surfer.id}>
              {showCutline && (
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="h-px flex-1 bg-accent" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                    Cutline
                  </span>
                  <div className="h-px flex-1 bg-accent" />
                </div>
              )}
              <RankingRow
                ranked={ranked}
                onClick={() => onSurferClick(ranked.surfer.id)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
