'use client'

import { useState } from 'react'
import { CollectionCard } from './CollectionCard'
import { AddCollectionModal } from './AddCollectionModal'
import { Toast } from '@/components/ui/Toast'
import type { Collection } from '@/types/threadflow'
import type { BoardOrder } from '@/lib/supabase/orders'

export function CollectionsClient({
  initialCollections,
  collectionOrders,
  usingMockData,
}: {
  initialCollections: Collection[]
  collectionOrders: BoardOrder[]
  usingMockData: boolean
}) {
  const [collections, setCollections] = useState<Collection[]>(initialCollections)
  const [isAdding, setIsAdding] = useState(false)
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null)

  function showToast(message: string, variant: 'success' | 'error' = 'success') {
    setToast({ message, variant })
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <main className="px-10 py-10 pb-16">
      <header className="flex justify-between items-end mb-10">
        <div>
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">
            Ready-to-Wear
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary mt-1">Collections</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl mt-2">
            Pre-made pieces available outside bespoke orders.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 text-label-caps font-label-caps tracking-widest hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          ADD NEW COLLECTION
        </button>
      </header>

      {usingMockData && (
        <div className="mb-8 flex items-center gap-2 border border-outline-variant bg-surface-container-low px-4 py-3">
          <span className="material-symbols-outlined text-sm text-on-surface-variant">info</span>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Showing demo data — connect the collections table in Supabase to see live collections.
          </p>
        </div>
      )}

      {collections.length === 0 ? (
        <div className="border border-outline-variant bg-surface-container-lowest px-6 py-16 text-center">
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            No collections yet — add your first ready-to-wear collection to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              orders={collectionOrders.filter((o) => o.collection_id === collection.id)}
            />
          ))}
        </div>
      )}

      {isAdding && (
        <AddCollectionModal
          onClose={() => setIsAdding(false)}
          onCreated={(collection) => {
            setCollections((prev) => [collection, ...prev])
            setIsAdding(false)
            showToast(`${collection.name} created.`)
          }}
        />
      )}

      {toast && <Toast message={toast.message} variant={toast.variant} />}
    </main>
  )
}
